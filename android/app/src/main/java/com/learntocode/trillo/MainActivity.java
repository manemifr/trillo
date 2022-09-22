package com.learntocode.trillo;
import android.os.Bundle;

import com.capacitorjs.plugins.camera.CameraPlugin;
import com.capacitorjs.plugins.device.DevicePlugin;
import com.capacitorjs.plugins.pushnotifications.PushNotificationsPlugin;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
//import com.getcapacitor.plugin;
import java.util.ArrayList;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState){
    super.onCreate(savedInstanceState);
    // initializes the Bridge
    registerPlugin(CameraPlugin.class);
    registerPlugin(DevicePlugin.class);
    registerPlugin(GoogleAuth.class);
    registerPlugin(PushNotificationsPlugin.class);
  }
}
