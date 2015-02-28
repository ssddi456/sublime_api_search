import sublime, sublime_plugin
import os
import re
import webbrowser
import urllib2
import threading
import json
from subprocess import Popen, PIPE

CREATE_NO_WINDOW = 0x08000000

setting_name = __name__ + '.settings'

def noop(non):
  pass

def noop2():
  pass

def load_setting():
  f = open(setting_name,'r')
  r = json.loads(f.read())
  f.close()
  r['visited'] = ('visited' in r) and r['visited'] or [];
  r['apis']    = ('apis' in r) and r['apis'] or [];

  return r;

def save_setting( setting ):
  f = open(setting_name,'w')
  f.write( json.dumps(setting))
  f.close()

class ShowApisCommand(sublime_plugin.TextCommand):
  def run(self, edit):
    apis = load_setting()['apis']
    def jumper( idx ):
      if idx == -1 :
        return
      webbrowser.open_new_tab(apis[idx][1])
    if len (apis) != 0 :
      self.view.window().show_quick_panel(apis, jumper)


class AddApisCommand(sublime_plugin.TextCommand):
  '''
    save api doc archors to local, use node as a grabber
  '''
  def run(self, edit):

    def add( url ):
      settings = load_setting()
      if url in settings['visited'] :
        sublime.message_dialog('url: ' + url + ' visited')
        return

      def worker():
        print url + ' grab start'
        thr = (Popen(['node','grabber.js',url], stdout=PIPE, stderr=PIPE, creationflags=CREATE_NO_WINDOW))
        res = thr.stdout.read()
        ree = thr.stderr.read()

        if not ree :
          print url + ' grab end with no err'
          res = json.loads(res)
          settings['visited'].append(url)
          settings['apis'] += res
          save_setting(settings)
        else :
          print url + ' grab end with err:' + ree

      t=threading.Thread(target=worker)
      t.start()

    self.view.window().show_input_panel('add api page url', 'http://lesscss.org/features/', add, noop, noop2)