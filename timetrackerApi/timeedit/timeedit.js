import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import TimeEdit from "timeedit-api";

function App() {
  useEffect(() => {
    const kek = new TimeEdit("https://cloud.timeedit.net/uu/web/schema/ri1Q5006.html");
    kek
      .getCourseId("2fe021", 5)
      .then(cid => {
        return kek.getCourse(cid);
      })
      .then(course => {
        console.log(course);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
