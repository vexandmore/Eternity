import React from "react";
import "./ContentScreen.css";

const ContentScreen: React.FC<{ hasContent: boolean }> = ({ hasContent }) => {
    return (
      <div className="content-screen">
        {hasContent ? (
          <p>Your future content here</p> // This would be your dynamic content area
        ) : (
          <p>No content available</p>
        )}
      </div>
    );
  };
  

export default ContentScreen;
