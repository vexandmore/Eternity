import React , {ReactNode} from "react";
import "./ContentScreen.css";

const ContentScreen: React.FC<{ content: ReactNode }> = ({ content }) => {
    return (
      <div className="content-screen">
        {content}
      </div>
    );
  };
  

export default ContentScreen;
