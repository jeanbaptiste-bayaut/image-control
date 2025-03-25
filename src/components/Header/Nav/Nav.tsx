import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './Nav.css';
import Upload from '../../Upload/Upload';

type NavProps = {
  nav: boolean;
  setNav: React.Dispatch<React.SetStateAction<boolean>>;
};

function Nav({ nav, setNav }: NavProps) {
  return (
    <nav className="nav">
      <button onClick={() => setNav(!nav)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <ul>
        <li>
          <a href="#">Upload products</a>
          <Upload />
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
