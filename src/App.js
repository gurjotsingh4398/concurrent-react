import React, { Suspense, Fragment } from "react";
import { unstable_createResource as createResource } from "react-cache";

import "./App.css";

const APIResource = createResource(() =>
  fetch("http://www.splashbase.co/api/v1/images/latest").then(res => res.json())
);

const ImgFetcher = createResource(
  src =>
    new Promise(resolve => {
      const image = new Image();
      image.onload = () => resolve(src);
      image.src = src;
    })
);

const Img = props => {
  return (
    <img
      alt={props.alt}
      style={{ width: "100px" }}
      src={ImgFetcher.read(props.src)}
    />
  );
};

const List = () => {
  window.console.log(APIResource.read());
  const data = APIResource.read();

  return (
    <ul>
      {data.images.map(item => (
        <li style={{ listStyle: "none" }} key={item.id}>
          <Suspense
            maxDuration={1500}
            fallback={<img src={item.url} alt={item.id} />}
          >
            <Img src={item.url} alt={item.id} />
          </Suspense>
        </li>
      ))}
    </ul>
  );
};

const App = () => (
  <Fragment>
    <Suspense fallback={<div>Loading...</div>}>
      <List />
    </Suspense>
  </Fragment>
);

export default App;
