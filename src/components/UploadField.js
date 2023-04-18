import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FileInput, SelectFileButton } from "./MusicEditor/styles";

function UploadField({ onFileChange }) {
  return (
    <SelectFileButton>
      <FontAwesomeIcon icon={faUpload} /> 파일 선택
      <FileInput type="file" onChange={onFileChange} />
    </SelectFileButton>
  );
}

export default UploadField;
