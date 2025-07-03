import {
  HtmlEditor,
  Image,
  Inject,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Table,
  Toolbar,
} from "@syncfusion/ej2-react-richtexteditor";
import * as React from "react";
import "/node_modules/@syncfusion/ej2-base/styles/material.css";
import "/node_modules/@syncfusion/ej2-icons/styles/material.css";
import "/node_modules/@syncfusion/ej2-buttons/styles/material.css";
import "/node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
import "/node_modules/@syncfusion/ej2-inputs/styles/material.css";
import "/node_modules/@syncfusion/ej2-lists/styles/material.css";
import "/node_modules/@syncfusion/ej2-navigations/styles/material.css";
import "/node_modules/@syncfusion/ej2-popups/styles/material.css";
import "/node_modules/@syncfusion/ej2-richtexteditor/styles/material.css";

function CustomEditor(props) {
  const toolbarSettings = {
    items: [
      "Bold",
      "Italic",
      "Underline",
      "StrikeThrough",
      "SuperScript",
      "SubScript",
      "|",
      "FontName",
      "FontSize",
      // "LineSpacing",
      "FontColor",
      "BackgroundColor",
      "LowerCase",
      "UpperCase",
      "|",
      "Formats",
      "Alignments",
      // 'OrderedList', 'UnorderedList',
      "Outdent",
      "Indent",
      "|",
      "CreateLink",
      "Image",
      // 'SourceCode',
      "|",
      "ClearFormat",
      "Print",
      "FullScreen",
      "|",
      "Undo",
      "Redo",
      "CreateTable",
    ],
  };

  const quickToolbarSettings = {
    image: [
      "Replace",
      "Align",
      "Caption",
      "Remove",
      "InsertLink",
      "OpenImageLink",
      "-",
      "EditImageLink",
      "RemoveImageLink",
      "Display",
      "AltText",
      "Dimension",
    ],
    link: ["Open", "Edit", "UnLink"],
  };

  const pasteCleanupSettings = {
    prompt: true,
    plainText: true,
  };

  const handleChange = (args) => {
    if (props.onChange) {
      props.onChange(args.value);
    }
  };

  const imageUploadPath =
    "https://learnathon.bitsathy.ac.in/api/college/coe/questionBank/upload/image";

  return (
    <>
      <label dangerouslySetInnerHTML={{ __html: props.label }}></label>
      <RichTextEditorComponent
        className="mt-2"
        change={handleChange}
        height={props.height}
        toolbarSettings={toolbarSettings}
        quickToolbarSettings={quickToolbarSettings}
        pasteCleanupSettings={pasteCleanupSettings}
        value={props.value}
        insertImageSettings={{
          saveUrl: imageUploadPath,
          path: imageUploadPath + "/",
          saveFormat: "Base64",
        }}
      >
        <Inject
          services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar, Table]}
        />
      </RichTextEditorComponent>
    </>
  );
}

export default CustomEditor;
