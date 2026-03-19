# How to Deploy Laws Navigator to Netlify

If your app shows "Both AI services failed" or "API Key missing" after deploying, it is because **Netlify does not know your API Key**. You must add it manually.

## Step 1: Add Environment Variable in Netlify

1. Go to your **Netlify Dashboard** (app.netlify.com).
2. Click on your **Laws Navigator** site.
3. Click on **Site configuration** (left sidebar).
4. Click on **Environment variables**.
5. Click **Add a variable** > **Add a single variable**.
6. Enter these details:
   - **Key:** `VITE_GEMINI_API_KEY`
   - **Value:** `your_key_here`
   - **Scopes:** Select "All scopes" (Build, Deploy, Runtime).
7. Click **Create variable**.

## Step 2: Re-deploy Site

Adding the variable alone isn't enough; you must rebuild the site.

1. Go to the **Deploys** tab (left sidebar).
2. Click **Trigger deploy** > **Clear cache and deploy site**.
3. Wait for the build to finish (Status: **Published**).

## Step 3: Test

Open your deployed site link and try "Analyze Case". It should work now!
