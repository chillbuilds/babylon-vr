async function connectBLE() {
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ['12345678-1234-1234-1234-123456789abc'] }]
    });

    const server = await device.gatt.connect();

    const service = await server.getPrimaryService('12345678-1234-1234-1234-123456789abc');

    const commandChar = await service.getCharacteristic('12345678-1234-1234-1234-123456789abd');
    const feedbackChar = await service.getCharacteristic('12345678-1234-1234-1234-123456789abe');

    await feedbackChar.startNotifications();
    feedbackChar.addEventListener('characteristicvaluechanged', event => {
      const value = new TextDecoder().decode(event.target.value);
      console.log('Feedback from ESP32:', value);
    });

    // Send a command
    const encoder = new TextEncoder();
    await commandChar.writeValue(encoder.encode('A button pressed'));

  } catch (error) {
    console.error('BLE Error:', error);
  }
}
