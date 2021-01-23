module.exports = {
  config: `module.exports = {
  CDNJS: [],
  CDNCSS: [],
  config: {
    ts: false,
    css: []
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      return {}
    } else {
      return {}
    }
  },
  chainWebpack: (config) => {

  }
}`, 
  template: `import React from 'react';
import ReactDOM from 'react-dom';
  
ReactDOM.render(<h1>Hello Serein</h1>, document.getElementById('root'));`
}