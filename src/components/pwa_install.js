// Import necessary libraries
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Download } from 'react-bootstrap-icons';
import { BrowserView, MobileView } from 'react-device-detect';

import "../assets/css/pwa_install.css";
import browser_install_1 from "../assets/images/screenshot_browser_install_1.png";
import browser_install_2 from "../assets/images/screenshot_browser_install_2.png";
import safari_install_1 from "../assets/images/ios_safari_install_1.png";
import safari_install_2 from "../assets/images/ios_safari_install_2.png";
import safari_install_3 from "../assets/images/ios_safari_install_3.png";


// Detect device type (iOS or Android)
const getDeviceType = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'iOS';
  }
  if (/android/i.test(userAgent)) {
    return 'Android';
  }
  return 'unknown';
};

// Update the PWAInstallModal component to display device-specific instructions
const PWAInstallModal = () => {
  const [show, setShow] = useState(false);
  const deviceType  = getDeviceType();

  const handleToggle = () => setShow(!show);

  const renderInstructions = () => {
    if (deviceType === 'Android') {
      return (
        <>
          <p>1. Tap the menu button in Chrome.</p>
          <p>2. Tap "Add to Home Screen".</p>
          <p>3. Confirm the installation by tapping "Add".</p>
        </>
      );
    }else{
        //iOS or Unknwo
        return (
            <>
                <BrowserView className={`pwa_install`}>
                    <p>The Discovery Tool can be installed as an app on your desktop or laptop from the Google Chrome Browser.
                        This will enable offline use of the app after being loaded for the first time.</p>
                    <ol>
                        <li >
                            <img style={{ maxWidth: '85%', borderRadius: '10px', display: 'block' }} src={browser_install_1}></img>
                            <caption>Click on the pictured icon in your URL bar</caption>
                        </li>
                        <li >
                            <img style={{ maxWidth: '85%', borderRadius: '10px', display: 'block' }} src={browser_install_2}></img>
                            <caption>Confirm installation by clicking on the "Install" button</caption>
                        </li>
                    </ol>
                </BrowserView>
                <MobileView className={`pwa_install`}>
                    <p>The Discovery Tool can be installed as an app on your iOS device (iPhone, iPad) using the safari browser.
                        This will install an app icon on hour homescreen and enable offline use of the app after being loaded for the first time.</p>
                    <ol>
                        <li >
                            <img style={{ maxWidth: '85%', borderRadius: '10px', display: 'block' }} src={safari_install_1}></img>
                            <caption>Click on the share icon at the bottom of the Safari window (pictured)</caption>
                        </li>
                        <li >
                            <img style={{ maxWidth: '85%', borderRadius: '10px', display: 'block' }} src={safari_install_2}></img>
                            <caption>Click on "Add to Home Screen" from the context menu that pops up</caption>
                        </li>
                        <li >
                            <img style={{ maxWidth: '85%', borderRadius: '10px', display: 'block' }} src={safari_install_3}></img>
                            <caption>Confirm installation by clicking on "Add"</caption>
                        </li>
                        <li >
                            <caption>Finally an app icon will appear somewhere on your device's homescreen!</caption>
                        </li>
                    </ol>
                </MobileView>
            </>
        )
    }
  };

  return (
    <>
      <Download onClick={handleToggle} className={`pwa_install_btn`}>
        Install
      </Download>

      <Modal show={show} onHide={handleToggle}>
        <Modal.Header>
          <Modal.Title>App Installation Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderInstructions()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleToggle}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PWAInstallModal;