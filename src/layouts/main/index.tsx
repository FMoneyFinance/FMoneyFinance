
import NavBar from "../../components/NavBar";
import "./styles.scss";

function MainLayout({ hideConnect, children, ...other }: any) {
  return (
    <div className="container">
      <NavBar />

      {children}
    </div>
  );
}

export default MainLayout;
