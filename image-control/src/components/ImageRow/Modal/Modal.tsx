import './Modal.css';
import { useState } from 'react';

type FormDataProps = {
  pattern: string;
  color: string;
  shot: string;
  naming: string;
  light: string;
  view: string;
  other: string;
};

type ModalProps = {
  data: {
    product: {
      pattern: string;
      color: string;
      name: string;
    };
    view: string;
    shot: number;
    exportTable: FormDataProps[];
    setExportTable: React.Dispatch<React.SetStateAction<FormDataProps[]>>;
  };
};

function Modal(data: ModalProps) {
  const [modal, setModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    pattern: '',
    color: '',
    shot: `${data.data.view}${data.data.shot}`,
    naming: 'false',
    light: 'false',
    view: 'false',
    other: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    data.data.setExportTable([
      ...data.data.exportTable,
      {
        pattern: data.data.product.pattern,
        color: data.data.product.color,
        shot: formData.shot,
        naming: formData.naming,
        light: formData.light,
        view: formData.view,
        other: formData.other,
      },
    ]);
    setModal(!modal);
    setFormData({
      pattern: '',
      color: '',
      shot: `${data.data.view}${data.data.shot}`,
      naming: 'false',
      light: 'false',
      view: 'false',
      other: '',
    });
  };

  return (
    <>
      <button className="modal__button" onClick={() => setModal(!modal)}>
        Edit
      </button>
      {modal && (
        <div className="modal__container">
          <div className="modal__content">
            <form onSubmit={(e) => handleSubmit(e)}>
              <label>
                Naming
                <input
                  type="checkbox"
                  value={formData.naming}
                  name="naming"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.checked,
                    })
                  }
                />
              </label>
              <label>
                Light
                <input
                  type="checkbox"
                  value={formData.light}
                  name="light"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.checked,
                    })
                  }
                />
              </label>
              <label>
                Missing view
                <input
                  type="checkbox"
                  value={formData.view}
                  name="view"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.checked,
                    })
                  }
                />
              </label>
              <label>
                Other
                <textarea
                  name="other"
                  value={formData.other}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </label>
              <button className="modal__content__button" type="submit">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
