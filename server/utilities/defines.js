/* globals module */
'use strict'

module.exports = {
  setConfig (config) {
    return (req, res, next) => {
      if (!req.hasOwnProperty('config')) {
        req.config = {}
      }
      let key
      for (key in config) {
        req.config.key = config.key
      }
      next()
    }
  },
  getUserTitles: () => {
    return ['Mr.', 'Mrs.', 'Mr. & Mrs.', 'Miss', 'Ms.', 'Dr. and Mrs.', 'Mr. and Dr.']
  },
  getPhoneTypes: () => {
    return ['Work', 'Home', 'Mobile', 'Fax']
  },
  getAreas: () => {
    return ['Town', 'Dionis', 'Sconset', 'Cisco', 'Madaket', 'Brant Point', 'Cliff', 'Edge of Town', 'Hummock Pond', 'Madequecham', 'Miacomet', 'Mid-Island', 'Naushop', 'Monomoy', 'Nashaquisset', 'Pocomo', 'Polpis', 'Quaise', 'Quidnet', 'Shawkemo', 'Shimmo', 'Squam', 'Surfside', 'Tom Nevers', 'Wauwinet']
  },
  getBedroomTypes: () => {
    return ['King', 'Queen', 'Full', 'Double', 'Twin', 'Twins', 'Bunk Beds', 'Pull Out Sofa']
  },
  getBathTypes: () => {
    return ['Full', 'Half', 'Shower', 'Tub with Shower']
  },
  getFloors: () => {
    return ['First Floor', 'Second Floor', 'Third Floor', 'Lower Level', 'Cottage/Studio']
  },
  getImgWithSuffix: (img, suffix) => {
    let dotPosition = (img) ? img.lastIndexOf('.') : img;
    if (dotPosition > -1 && img) {
        let imgSuffix = (suffix) ? '_' + suffix : '_medium';
        let beforeDot = img.substring(0, dotPosition);
        let afterDot = img.substr(img.lastIndexOf('.') + 1);
        img = beforeDot + imgSuffix + '.' + afterDot;
    }
    if (img) {
        return img;
    } else {
        return '';
    }
  }
}
