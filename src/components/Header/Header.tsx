import axios from 'axios';
import Nav from './Nav/Nav';
import { CSVLink } from 'react-csv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import { useState } from 'react';
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

function Header(lineList: LineListProp) {
  const [overlay, setOverlay] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [nav, setNav] = useState(false);

  async function getObservations() {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}` + '/api/products/observations'
    );
    setCsvData(result.data);
  }

  return (
    <header className="app__header">
      <section className="app__header__left-part">
        <div className="menu-burger" onClick={() => setNav(!nav)}>
          <div className="menu-burger-line"></div>
          <div className="menu-burger-line"></div>
          <div className="menu-burger-line"></div>
          {nav ? <Nav nav={nav} setNav={setNav} /> : null}
        </div>
        <figure className="app__header__thumbnail">
          <img
            onClick={() => setOverlay(true)}
            src={`https://images.napali.app/_/dcshoes/hires/${
              lineList.lineList[lineList.index].pattern
            }_${lineList.lineList[lineList.index].color}.jpg`}
          />

          <div
            className="overlay"
            style={{
              display: overlay == true ? 'block' : 'none',
            }}
          >
            <figure>
              <img
                src={`https://images.napali.app/_/dcshoes/hires/${
                  lineList.lineList[lineList.index].pattern
                }_${lineList.lineList[lineList.index].color}.jpg`}
                // alt={`${view.view}-${shot.shot}`}
              />
              <button onClick={() => setOverlay(false)}>X</button>
            </figure>
          </div>
        </figure>
        <h3>{lineList.lineList[lineList.index].name}</h3>
        <p>
          {lineList.lineList[lineList.index].pattern}-
          {lineList.lineList[lineList.index].color}
        </p>
        <p>
          {lineList.index + 1} / {lineList.lineList.length}
        </p>
      </section>
      {csvData.length < 1 ? (
        <button
          className="app__header__right-part"
          onClick={async () => {
            await getObservations();
          }}
        >
          <FontAwesomeIcon
            icon={faFileDownload}
            size="xl"
            style={{ color: '#cfd0d3' }}
          />
        </button>
      ) : null}
      {csvData.length > 1 ? (
        <CSVLink data={csvData} filename="observations.csv">
          <button
            className="app__header__right-part"
            onClick={() => setCsvData([])}
          >
            <FontAwesomeIcon
              icon={faFileDownload}
              size="xl"
              style={{ color: '#2fa059' }}
            />
          </button>
        </CSVLink>
      ) : null}
    </header>
  );
}

export default Header;
