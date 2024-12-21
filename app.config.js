const config = {
  name: 'Later',
  slug: 'my-later',
  extra: {
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  },
  "android": {
    "package": "com.mihaibundea1.mylater"
  }
};

export default config;