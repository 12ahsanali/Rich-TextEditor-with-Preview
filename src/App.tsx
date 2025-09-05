import TextEditor from './Components/TextEditor';
import TextEditorReturn from './Components/TextEditorReturns';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/plugins.pkgd.min.css';
import 'froala-editor/css/themes/gray.min.css'; 
import 'froala-editor/js/plugins.pkgd.min.js';
import EditorWithPreview from './Components/EditorWithPreview';

function App() {

  return (
    <>
     <TextEditorReturn/>
    {/* <EditorWithPreview/> */}
     {/* <TextEditor/> */}
    </>
  )
}

export default App
