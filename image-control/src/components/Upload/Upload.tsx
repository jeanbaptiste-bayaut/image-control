import './Upload.css';
import axios from 'axios';
import { useState } from 'react';

function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<boolean>(false);

  async function handleFile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }

    try {
      // Call to the upload coupon endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL_PROD}/api/products/list`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        setUploadStatus(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="upload__container">
      <form
        id="uplaodForm"
        encType="multipart/form-data"
        onSubmit={(event) => handleFile(event)}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <input
          type="file"
          accept=".csv"
          id="file"
          name="file"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />
        <button type="submit">Upload</button>
      </form>
      {uploadStatus && <p>File uploaded successfully</p>}
    </div>
  );
}

export default Upload;
