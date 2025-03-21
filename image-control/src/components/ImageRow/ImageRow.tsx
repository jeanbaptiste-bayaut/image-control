import './ImageRow.css';
import Modal from './Modal/Modal';
import axios from 'axios';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

type LineListProp = {
  lineList: {
    pattern: string;
    color: string;
    name: string;
    status: string;
  }[];
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  status: ProductStatusProps[];
  setStatus: React.Dispatch<React.SetStateAction<ProductStatusProps[]>>;
};

type ProductStatusProps = {
  checked: boolean;
  pattern: string;
  color: string;
};

type OverlayProps = {
  status: boolean;
  view: string;
  shot: number;
};

type FormDataProps = {
  pattern: string;
  color: string;
  shot: string;
  naming: string;
  light: string;
  view: string;
  other: string;
};

function ImageRow(lineList: LineListProp) {
  const [nbOfShots] = useState([
    { shot: 1 },
    { shot: 2 },
    { shot: 3 },
    { shot: 4 },
    { shot: 5 },
  ]);
  const [views] = useState([
    { view: 'frt' },
    { view: 'bck' },
    { view: 'dtl' },
    { view: 'sd' },
  ]);
  const [overlay, setOverlay] = useState<OverlayProps>({
    status: false,
    view: '',
    shot: 0,
  });
  const [exportTable, setExportTable] = useState<FormDataProps[]>([]);
  const [active, setActive] = useState(false);

  function handleSaveObservations() {
    const result = axios.post(
      `${import.meta.env.VITE_API_URL_PROD}/api/products/observations`,
      {
        observations: exportTable,
      }
    );

    if (!result) {
      console.error('Error saving observations');
    }

    setExportTable([]);
  }

  function handleMissingImages() {
    setActive(true);
    setExportTable([
      ...exportTable,
      {
        pattern: lineList.lineList[lineList.index].pattern,
        color: lineList.lineList[lineList.index].color,
        shot: 'ALL',
        naming: 'false',
        light: 'false',
        view: 'true',
        other: 'No images found',
      },
    ]);
    setTimeout(setActive, 1500, false);
  }

  async function changeStatus(data: {
    pattern: string;
    color: string;
    name: string;
    status: string;
  }) {
    const list = [
      {
        pattern: data.pattern,
        color: data.color,
      },
    ];

    try {
      const result = await axios.post(
        `${import.meta.env.VITE_API__PROD}/api/products/status`,
        { list }
      );

      if (!result) {
        console.error('Error changing status');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="app__image__row">
      <div className="app__image__row__buttons">
        <button
          className={active ? 'no-images active' : 'no-images'}
          onClick={handleMissingImages}
        >
          No Images
        </button>
        <section className="app__image__row__buttons__right">
          <button
            disabled={lineList.index == 0}
            className="app__image__row__button"
            onClick={() => lineList.setIndex(lineList.index - 1)}
          >
            Previous
          </button>
          <button
            className="app__image__row__button"
            onClick={() => {
              changeStatus(lineList.lineList[lineList.index]);
              lineList.setIndex(lineList.index + 1);
            }}
          >
            Next
          </button>
          <button
            onClick={() => {
              handleSaveObservations();
            }}
          >
            <FontAwesomeIcon icon={faFloppyDisk} size="xl" />
          </button>
        </section>
      </div>
      <table className="app__image__row__table">
        <thead></thead>
        <tbody>
          {views.map((view) => {
            return (
              <tr key={view.view}>
                {nbOfShots.map((shot) => {
                  return (
                    <td className="app__image__row__card" key={shot.shot}>
                      <figure
                        className="figure-normal"
                        onClick={() =>
                          setOverlay({
                            status: true,
                            view: view.view,
                            shot: shot.shot,
                          })
                        }
                      >
                        <figcaption>{`${view.view}${shot.shot}`}</figcaption>
                        <img
                          src={`https://images.napali.app/global/dcshoes-products/all/default/hi-res/${
                            lineList.lineList[lineList.index].pattern
                          }_dcshoes,p_${
                            lineList.lineList[lineList.index].color
                          }_${view.view}${shot.shot}.jpg`}
                        />
                      </figure>
                      <div
                        className="overlay"
                        style={{
                          display:
                            overlay.status == true &&
                            overlay.shot == shot.shot &&
                            overlay.view == view.view
                              ? 'block'
                              : 'none',
                        }}
                      >
                        <figure
                          style={{
                            width: '650px',
                            height: 'auto',
                            padding: '10px',
                          }}
                        >
                          <img
                            onClick={() =>
                              setOverlay({
                                status: false,
                                view: '',
                                shot: 0,
                              })
                            }
                            style={{
                              width: '100%',
                              minHeight: '400px',
                              objectFit: 'cover',
                            }}
                            src={`https://images.napali.app/global/dcshoes-products/all/default/hi-res/${
                              lineList.lineList[lineList.index].pattern
                            }_dcshoes,p_${
                              lineList.lineList[lineList.index].color
                            }_${view.view}${shot.shot}.jpg`}
                            // alt={`${view.view}-${shot.shot}`}
                          />
                          <button
                            style={{ position: 'absolute', top: 10, right: 10 }}
                            onClick={() =>
                              setOverlay({
                                status: false,
                                view: '',
                                shot: 0,
                              })
                            }
                          >
                            X
                          </button>
                        </figure>
                      </div>
                      <Modal
                        data={{
                          product: lineList.lineList[lineList.index],
                          view: view.view,
                          shot: shot.shot,
                          exportTable,
                          setExportTable,
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export default ImageRow;
