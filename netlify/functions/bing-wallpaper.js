// netlify/functions/bing-proxy.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    // 获取必应原始数据
    const apiResponse = await fetch('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN');
    const data = await apiResponse.json();
    
    // 解析基础信息
    const baseUrl = data.images[0].urlbase; // 示例："/th?id=OHR.ApisMellifera_ZH-CN"
    const copyright = data.images[0].copyright;

    // 生成不同分辨率图片地址
    const resolutions = {
      pc: '_1920x1080',    // 桌面端
      pad: '_1366x768',    // 平板
      mobile: '_1080x1920' // 手机竖屏
    };

    // 构建完整URL对象
    const images = {
      uhd: `https://www.bing.com${data.images[0].url}`,
      pc: `https://www.bing.com${baseUrl}${resolutions.pc}.jpg`,
      pad: `https://www.bing.com${baseUrl}${resolutions.pad}.jpg`,
      mobile: `https://www.bing.com${baseUrl}${resolutions.mobile}.jpg`,
      copyright: copyright
    };

    return {
      statusCode: 200,
      body: JSON.stringify(images)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch Bing wallpaper" })
    };
  }
};
