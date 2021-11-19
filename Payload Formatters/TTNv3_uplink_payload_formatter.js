function decodeUplink(input) {
    var data = {};
    var warnings = [];

    if (input.fPort == 10) {
  
      data.framelen = (input.bytes[1] << 8) | input.bytes[0];
      data.pm10_standard = (input.bytes[3] << 8) | input.bytes[2];
      data.pm25_standard = (input.bytes[5] << 8) | input.bytes[4];
      data.pm100_standard = (input.bytes[7] << 8) | input.bytes[6];
      data.pm10_env = (input.bytes[9] << 8) | input.bytes[8];
      data.pm25_env = (input.bytes[11] << 8) | input.bytes[10];
      data.pm100_env = (input.bytes[13] << 8) | input.bytes[12];
      data.particles_03um = (input.bytes[15] << 8) | input.bytes[14];
      data.particles_05um = (input.bytes[17] << 8) | input.bytes[16];
      data.particles_10um = (input.bytes[19] << 8) | input.bytes[18];
      data.particles_25um = (input.bytes[21] << 8) | input.bytes[20];
      data.particles_50um = (input.bytes[23] << 8) | input.bytes[22];
      data.particles_100um = (input.bytes[25] << 8) | input.bytes[24];
  
      return {
        data: data
       };
    }
    else {
        warnings.push("Unsupported fPort");
    }
    return {
        data: data,
        warnings: warnings
    };
}