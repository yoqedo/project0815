import React from "react";

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      key="plausible-script"
      async
      src="https://plausible.io/js/pa-4DYJ3LywDQdSVBcR700ex.js"
    />,
    <script
      key="plausible-init"
      dangerouslySetInnerHTML={{
        __html: `
          window.plausible = window.plausible || function() {
            (plausible.q = plausible.q || []).push(arguments);
          };
          plausible.init = plausible.init || function(i) {
            plausible.o = i || {};
          };
          plausible.init();
        `,
      }}
    />,
  ]);
};
