
var $cd = cyberDojo;

TestCase("cyberdojo-Test", {
  
  "test filenames() finds all filenames": function() {
    /*:DOC +=
      <div>
        <textarea id="file_content_for_cyberdojo.sh"></textarea>
        <textarea id="file_content_for_instructions"></textarea>
      </div>
    */
    assertEquals(['cyberdojo.sh', 'instructions'], $cd.filenames());
  },
  
  "test filenameAlreadyExists() returns true when visible filename exists": function() {
    /*:DOC +=
      <div>
        <textarea id="file_content_for_cyberdojo.sh"></textarea>
        <textarea id="file_content_for_instructions"></textarea>
      </div>
    */
    $cd.support_filenames = function() { return [ ] };
    $cd.hidden_filenames = function() { return [ ] };    
    assert($cd.filenameAlreadyExists('cyberdojo.sh'));    
  },
  
  "test filenameAlreadyExists() returns true when hidden filename exists": function() {
    /*:DOC +=
      <div>
        <textarea id="file_content_for_cyberdojo.sh"></textarea>
        <textarea id="file_content_for_instructions"></textarea>
      </div>
    */
    $cd.support_filenames = function() { return [ ] };
    var hidden_filename = 'catch.hpp';
    $cd.hidden_filenames = function() { return [ hidden_filename ] };    
    assert($cd.filenameAlreadyExists(hidden_filename));    
  },
  
  "test filenameAlreadyExists() returns true when support filename exists": function() {
    /*:DOC +=
      <div>
        <textarea id="file_content_for_cyberdojo.sh"></textarea>
        <textarea id="file_content_for_instructions"></textarea>
      </div>
    */
    var support_filename = 'nunit.core.dll';
    $cd.support_filenames = function() { return [ support_filename ] };
    $cd.hidden_filenames = function() { return [ ] };    
    assert($cd.filenameAlreadyExists(support_filename));    
  },

  "test filenameAlreadyExists() returns false when filename doesn't exist": function() {
    /*:DOC +=
      <div>
        <textarea id="file_content_for_cyberdojo.sh"></textarea>
        <textarea id="file_content_for_instructions"></textarea>
      </div>
    */
    $cd.support_filenames = function() { return [ ] };
    $cd.hidden_filenames = function() { return [ ] };    
    assert(!$cd.filenameAlreadyExists('not.present'));    
  },

  "test sortFilenames() sorts filenames into ascending order": function() {
    var filenames = [ 'a', 'z', 's']
    filenames.sort();
    var expected = [ 'a', 's', 'z' ]
    assertEquals(expected, filenames);
  },
  
  "test currentFilename() finds file in filelist that is selected": function() {
    /*:DOC +=
      <div>
        <div>
          <input id="radio_A" name="filename" type="radio" value="A"/>
          <input id="radio_B" name="filename" type="radio" value="B" checked="checked"/>
        </div>
        <input type="hidden" name="current_filename" id="current_filename" value="B"/>
        <div>
          <textarea id="file_content_for_A">a</textarea>
          <textarea id="file_content_for_B">b</textarea>
        </div>        
      </div>
    */
    assertEquals('B', $cd.currentFilename());
    $cd.selectFileInFileList('A');
    assertEquals('A', $cd.currentFilename());
  },
  
  "test fileContentFor() retrieves dom node": function() {
    /*:DOC +=
      <div>
        <textarea id="file_content_for_A">src</textarea>
      </div>
    */
    assertEquals('src', $cd.fileContentFor('A').attr('value'));
  },
  
  "test loadNextFile() rotates through all files in filelist": function() {
    /*:DOC +=
      <div>
        <div>
          <input id="radio_A" name="filename" type="radio" value="A"/>
          <input id="radio_B" name="filename" type="radio" value="B" checked="checked"/>
          <input id="radio_C" name="filename" type="radio" value="C"/>
        </div>
        <input type="hidden" name="current_filename" id="current_filename" value="B"/>        
        <div>
          <textarea id="file_content_for_A">a</textarea>
          <textarea id="file_content_for_B">b</textarea>
          <textarea id="file_content_for_C">c</textarea>
        </div>
      </div>
    */
    assertEquals(['A', 'B', 'C'], $cd.filenames());
    assertEquals('B', $cd.currentFilename());
    $cd.loadNextFile();
    assertEquals(['A', 'B', 'C'], $cd.filenames());
    assertEquals('C', $cd.currentFilename());
    $cd.loadNextFile();
    assertEquals(['A', 'B', 'C'], $cd.filenames());
    assertEquals('A', $cd.currentFilename());
    $cd.loadNextFile();
    assertEquals(['A', 'B', 'C'], $cd.filenames());
    assertEquals('B', $cd.currentFilename());
  },
  
  "test makeFileListEntry()": function() {
    var entry = $cd.makeFileListEntry('omd');
    assertFunction(entry.click);
    var input = entry.contents('input');
    assertEquals(1, input.length);
    assertEquals('radio_omd', input.attr('id'));
    assertEquals('filename', input.attr('name'));
    assertEquals('radio', input.attr('type'));
    assertEquals('omd', input.attr('value'));
    var label = entry.children('label');
    assertEquals(1, label.length);
    assertEquals('omd', label.html());
  },
  
  "test makeNewFile()": function() {
    $cd.tabExpansion = function() { return "  "; };
    var hi = $cd.makeNewFile('its.name', 'its.content');
    assertEquals('filename_div', hi.attr('class'));
    assertEquals('its.name', hi.attr('name'));
    assertEquals('its.name_div', hi.attr('id'));
  },
  
  "test doDelete() deletes file from filelist": function() {
    /*:DOC +=
      <div>
        <div>
          <input id="radio_A" name="filename" type="radio" value="A"/>
          <input id="radio_B" name="filename" type="radio" value="B" checked="checked"/>
          <input id="radio_C" name="filename" type="radio" value="C"/>
        </div>
        <input type="hidden" name="current_filename" id="current_filename" value="B"/>                
        <div>
          <div id="A_div">
            <textarea id="file_content_for_A"></textarea>
          </div>
          <div id="B_div">          
            <textarea id="file_content_for_B"></textarea>
          </div>
          <div id="C_div">            
            <textarea id="file_content_for_C"></textarea>
          </div>
        </div>
      </div>
    */
    assertEquals(['A', 'B', 'C'], $cd.filenames());
    var filename = 'B';
    assertEquals(filename, $cd.currentFilename());
    $cd.doDelete('B');
    assertEquals(['A', 'C'], $cd.filenames());
    assertTrue($cd.currentFilename() == 'A' || $cd.currentFilename() == 'C');
  },
  
  "test deleteFilePrompt(avatar_name,false)": function() {
    /*:DOC +=
      <div>
        <div>
          <input id="radio_A" name="filename" type="radio" value="A"/>
          <input id="radio_B" name="filename" type="radio" value="B" checked="checked"/>
          <input id="radio_C" name="filename" type="radio" value="C"/>
        </div>
        <input type="hidden" name="current_filename" id="current_filename" value="B"/>                
        <div>
          <div id="A_div">        
            <textarea id="file_content_for_A">aaaaaaaaaaa</textarea>
          </div>
          <div id="B_div">
            <textarea id="file_content_for_B">bbbbbbbbbbb</textarea>
          </div>
          <div id="C_div">
            <textarea id="file_content_for_C">ccccccccccc</textarea>
          </div>
        </div>
      </div>
    */
    assertEquals(['A', 'B', 'C'], $cd.filenames());
    var filename = 'B';
    assertEquals(filename, $cd.currentFilename());
    $cd.deleteFilePrompt('snake', false);
    assertEquals(['A', 'C'], $cd.filenames());
    assertTrue($cd.currentFilename() == 'A' || $cd.currentFilename() == 'C');    
  },
  
  "test newFileContent":function() {
    /*:DOC +=
      <div>
        <div id="filename_list">
          <input id="radio_A" name="filename" type="radio" value="A"/>
          <input id="radio_B" name="filename" type="radio" value="B" checked="checked"/>
          <input id="radio_C" name="filename" type="radio" value="C"/>
        </div>
        <input type="hidden" name="current_filename" id="current_filename" value="B"/>                
        <div id="visible_files_container">
          <div id="A_div">        
            <textarea id="file_content_for_A">aaaaaaaaaaa</textarea>
          </div>        
          <div id="B_div">        
            <textarea id="file_content_for_B">bbbbbbbbbbb</textarea>
          </div>        
          <div id="C_div">        
            <textarea id="file_content_for_C">ccccccccccc</textarea>
          </div>        
        </div>        
      </div>
    */
    $cd.tabExpansion = function() { return "  "; };    
    assertEquals(['A', 'B', 'C'], $cd.filenames());

    var filename = 'D';
    var content = 'dddd';
    $cd.newFileContent(filename,content);
    assertEquals('dddd', $cd.fileContentFor('D').attr('value'));
    assertEquals(['A', 'B', 'C', 'D'], $cd.filenames());    
  },
  
  "test rebuildFilenameList() after adding a filename": function() {
    /*:DOC +=
      <div>
        <div id="filename_list">
          <input id="radio_A" name="filename" type="radio" value="A"/>
          <input id="radio_B" name="filename" type="radio" value="B"/>
        </div>
        <input type="hidden" name="current_filename" id="current_filename" value="B"/>                
        <div id="visible_files_container">
          <div id="A_div">
            <textarea id="file_content_for_A">aaaaaaaaaaa</textarea>
          </div>
          <div id="B_div">
            <textarea id="file_content_for_B">bbbbbbbbbbb</textarea>
          </div>
        </div>        
      </div>
    */
    $cd.tabExpansion = function() { return "  "; };    
    assertEquals(2, $cd.filenames().length);
    var filenames = $cd.rebuildFilenameList();
    
    var filename = 'C';
    var content = 'dddd';
    $cd.newFileContent(filename,content);
    filenames = $cd.rebuildFilenameList();
    assertEquals(3, filenames.length);
    assertEquals(['A','B','C'], filenames.sort());
  },
  
  "test rebuildFilenameList() after removing a filename": function() {
    /*:DOC +=
      <div>
        <div id="filename_list">
          <input id="radio_A" name="filename" type="radio" value="A"/>
          <input id="radio_B" name="filename" type="radio" value="B" checked="checked"/>
          <input id="radio_C" name="filename" type="radio" value="C"/>
        </div>
        <input type="hidden" name="current_filename" id="current_filename" value="B"/>                
        <div id="visible_files_container">
          <div id="A_div">
            <textarea id="file_content_for_A">aaaaaaaaaaa</textarea>
          </div>
          <div id="B_div">
            <textarea id="file_content_for_B">bbbbbbbbbb</textarea>
          </div>
          <div id="C_div">
            <textarea id="file_content_for_C">ccccccccc</textarea>
          </div>
        </div>        
      </div>
    */
    assertEquals(3, $cd.filenames().length);
    assertEquals('B', $cd.currentFilename());
    $cd.deleteFilePrompt(false);
    
    var filenames = $cd.rebuildFilenameList();
    assertEquals(2, filenames.length);
    assertEquals(['A','C'], filenames.sort());
  },
  
  "test renameFileFromTo()": function() {
    /*:DOC +=
      <div>
        <div id="filename_list">
          <input id="radio_A" name="filename" type="radio" value="A"/>
          <input id="radio_B" name="filename" type="radio" value="B" checked="checked"/>
          <input id="radio_C" name="filename" type="radio" value="C"/>
        </div>
        <input type="hidden" name="current_filename" id="current_filename" value="B"/>                
        <div id="visible_files_container">
          <div id="A_div">
            <textarea id="file_content_for_A">aaaaaaaaaaa</textarea>
          </div>
          <div id="B_div">
            <textarea id="file_content_for_B">bbbbbbbbbbb</textarea>
          </div>
          <div id="C_div">
            <textarea id="file_content_for_C">ccccccccccc</textarea>
          </div>
        </div>        
      </div>
    */
    $cd.tabExpansion = function() { return "  "; };    
    var oldFilename = 'B';
    var oldContent = $cd.fileContentFor(oldFilename);
    assertEquals(['A', oldFilename, 'C'], $cd.filenames());
    assertEquals(oldFilename, $cd.currentFilename());
    var newFilename = 'BB';
    $cd.renameFileFromTo('frog', oldFilename, newFilename);
    assertEquals(['A', newFilename, 'C'], $cd.filenames().sort());
    assertEquals(newFilename, $cd.currentFilename());
  }
  
});
