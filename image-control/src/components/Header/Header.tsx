import axios from 'axios';
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

  async function getObservations() {
    const result = await axios.get('http://localhost:8080/api/observations');
    console.log(result.data);
  }

  return (
    <header className="app__header">
      <section className="app__header__left-part">
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
      </section>
      <button
        className="app__header__right-part"
        onClick={() => {
          getObservations();
          window.location.reload();
        }}
      >
        <FontAwesomeIcon icon={faFileDownload} size="xl" />
      </button>
    </header>
  );
}

export default Header;
