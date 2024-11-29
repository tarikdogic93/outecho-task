# TopicHub

**TopicHub** is a full-stack web application built using [_Next.js_](https://nextjs.org/), [_Hono.js_](https://hono.dev/), [_TypeScript_](https://www.typescriptlang.org/), [_Tailwind CSS_](https://tailwindcss.com/), [_Shadcn UI_](https://ui.shadcn.com/), [_Drizzle ORM_](https://orm.drizzle.team/), [_Neon PostgreSQL_](https://neon.tech/), [_Zod_](https://zod.dev/), and [_Knock_](https://knock.app/) for notifications. The app allows users to interact with topics and comments, with features like user authentication, topic creation, comment submission, and notifications. The project is deployed to [_Vercel_](https://vercel.com/).

---

## **Features**

- **Homepage**

  - Displays the latest 20 topics with "Load More" functionality.
  - Lists users with the highest number of comments.
  - Shows topics with the most likes (hot topics).

- **Topic Page**

  - Displays details of a topic and its comments.
  - Users can like/dislike topics and comments.
  - Logged-in users can add, edit, or delete comments.
  - Only topic authors can edit or delete their topics.

- **User Authentication**

  - Login and registration system with validation.
  - Profile page for updating user details and changing passwords.
  - Avatar image generated using [_RoboHash API_](https://robohash.org/).

- **Notifications**
  - Users are notified when someone comments on their topic.

---

## **Environment Variables**

Before running the project, make sure to set up the following environment variables:

- `NEXT_PUBLIC_APP_URL` - The URL of the application
  (e.g., `http://localhost:3000/` in development or
  `https://outecho-task.vercel.app/` in production)
- `DATABASE_URL` - Connection string for the PostgreSQL database provided by Neon.
- `JWT_SECRET` - Secret key for signing JWT tokens.
- `ROBOHASH_API_URL` - URL for the RoboHash API, used for generating avatars (e.g., `https://robohash.org/`).
- `NEXT_PUBLIC_KNOCK_API_KEY` - Your Knock API key for notifications.
- `NEXT_PUBLIC_KNOCK_FEED_ID` - Your Knock feed ID.
- `KNOCK_SECRET_API_KEY` - Secret API key for Knock notifications.

---

## **How to Run the Project Locally**

### **Requirements**

- Node.js v22.x (with `bun` package manager installed)

### **Steps**

1. Clone the repository:

   ```bash
   git clone https://github.com/tarikdogic93/outecho-task
   cd outecho-task
   ```

2. Install dependencies using bun

   ```
   bun install
   ```

3. Set up environment variables:

- Create a `.env.local` file in the root directory.
- Populate it with the necessary environment variables listed above.

4. Set up the PostgreSQL database:

- Make sure you have a PostgreSQL instance running using a hosted solution like [_Neon_](https://neon.tech/).
- Create a database for the application and ensure that the DATABASE_URL environment variable is correctly configured in your `.env.local` file.

5. Run the development server:

   `bun run dev`

This should start the app on `http://localhost:3000`.

---

## **Future Enhancements**

1. **Search and Filtering Features**

- Implementing a powerful search functionality with filters would help users quickly find topics of interest. This would improve usability, especially as the number of topics and comments grows.

2. **Comment Replies**

- Allowing users to reply directly to comments would create threaded discussions, making it easier to follow conversations. This would improve engagement and provide a more organized way for users to interact with specific comments.

3. **Sophisticated Authentication with Auth.js**

- Implementing a more advanced authentication solution using [_Auth.js_](https://authjs.dev/) would allow for easy integration of multiple sign-in options, such as **Google Sign-In** and other **OAuth** providers. This would streamline the user registration and login process, offering a smoother and more secure experience for users.
