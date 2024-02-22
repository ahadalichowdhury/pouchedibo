
self.addEventListener("push", (event) => {
  try {
    console.log(event)
    const data = event.data.json();

    // Extract title and body from the notification object in your payload
    const title = data.notification.title;
    const body = data.notification.body;

    const options = {
      body: body,
    };
    console.log(options)

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (error) {
    console.error("Error parsing push data:", error);
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log(event);
  event.notification.close();
  
  const [message, urlToOpen] = event.notification?.body.split("#");
  console.log(message)
  console.log(urlToOpen
    
    )
  if (urlToOpen) {
    event.waitUntil(clients.openWindow(urlToOpen));
  } else {
    console.error("No click action URL found in the notification.");
  }
});

