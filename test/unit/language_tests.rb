require File.dirname(__FILE__) + '/../test_helper'
require 'Files'

class LanguageTests < ActionController::TestCase

  test "name" do
    language = make_language('C assert')    
    assert_equal 'C assert', language.name
  end
  
  test "dir and name are set" do
    language = make_language('Dummy')
    assert_equal 'Dummy', language.name
    assert_equal root_dir + '/languages/' + 'Dummy', language.dir
  end
  
  test "blank opening line of visible starter file is retained" do
    language = make_language('Dummy')
    lines = [ "", "def answer", "  42", "end" ]
    expected = lines.join("\n") + "\n"
    visible_files = language.visible_files
    assert_equal expected, visible_files['untitled.rb']
  end
  
  test "visible files are loaded but not output and not instructions" do
    language = make_language('Dummy')    
    visible_files = language.visible_files
    assert_match visible_files['test_untitled.rb'], /^require '\.\/untitled'/ 
    assert_nil visible_files['output']
    assert_nil visible_files['instructions']
  end
  
  test "hidden filenames are loaded" do
    language = make_language('Dummy')
    assert_equal ['hidden'], language.hidden_filenames
  end
  
  test "hidden filenames defaults to [ ] if not present" do
    language = make_language('Ruby-installed-and-working')
    assert_equal [ ], language.hidden_filenames    
  end
  
  test "unit test framework is loaded" do
    language = make_language('C assert')    
    assert_equal 'cassert', language.unit_test_framework
  end
  
  test "tab defaults to 4 if not present" do
    language = make_language('C assert')    
    assert_equal 4, language.tab_size
  end
  
  test "tab is loaded when not defaulted" do
    language = make_language('Dummy')    
    assert_equal 2, language.tab_size
  end
  
  test "C# is not loaded as C" do
    language = make_language('C#')
    assert_not_nil language.visible_files['Untitled.cs'] 
  end
  
  def make_language(name)
    Language.new(root_dir, name)
  end
    
end
