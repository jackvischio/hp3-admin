import React from "react";

const TitleBar = ({ title }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
            <span className="navbar-brand ms-4" >
                <a href="/" className="fw-bold no-underline text-black">HockeyPista3 admin</a> / {title}
            </span>
        </nav>
    );
};

export default TitleBar;
