const port = 8080;

module.exports = {  
  devServer: {
    proxy: 'http://localhost:8080'
  }
};
