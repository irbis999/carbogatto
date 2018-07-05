import device from 'current-device'

if(device.tablet()) {
  $('meta[name=viewport]').attr('content', 'width=1280')
}