exports.handler = async (event, context) => {
  try {
    const response = await fetch('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN');
    const data = await response.json();
    
    const imageUrl = `https://www.bing.com${data.images[0].url}`;
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        url: imageUrl,
        copyright: data.images[0].copyright
      }),
      headers: {'Content-Type': 'application/json'}
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({error: 'Failed to fetch wallpaper'})
    };
  }
};
