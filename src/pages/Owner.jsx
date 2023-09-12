import React, { useState, useEffect } from "react";
import "../css/flexboxes.css";
import "../css/texts.css";
import "../css/buttons.css";
import "../css/adminpanel.css";

import OwnerPanel from "../components/OwnerPanel";

export default function Owner() {
  return (
      <main>
        <OwnerPanel />
      </main>
  );
}
