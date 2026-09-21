plugins {
    id("com.android.application") version "8.2.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.22" apply false
}

tasks.register("prepareUsbBootDrive") {
    group = "pegasus"
    description = "Prepares the external USB pendrive boot environment at E:\\pegasus"
    doLast {
        val usbPath = file("E:/pegasus")
        if (!usbPath.exists()) {
            usbPath.mkdirs()
        }
        val bootDir = file("E:/pegasus/boot")
        val dataDir = file("E:/pegasus/data")
        val casesDir = file("E:/pegasus/cases")
        
        bootDir.mkdirs()
        dataDir.mkdirs()
        casesDir.mkdirs()
        
        logger.lifecycle("PEGASUS OS USB Boot & Persistent Storage directories configured at E:\\pegasus")
    }
}

