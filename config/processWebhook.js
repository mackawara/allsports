const processWebhook = async (req, handler) => {
    // Extract the unique ID, using Shopify for this example
    const unique_id = req.headers["X-Shopify-Webhook-Id"];
    // Create a new entry for that webhook id
    await client
      .query("INSERT INTO processed_webhooks (id) VALUES $1", [unique_id])
      .catch((e) => {
        // PostgreSQL code for unique violation
        if (e.code == "23505") {
          // We are already processing or processed this webhook, return silently
          return true;
        }
        throw e;
      });
    try {
      // Call you method
      await handler(req.body);
      return true;
    } catch {
    // Delete the entry on error to make sure the next one isn't ignored
      await client.query("DELETE FROM processed_webhooks WHERE id = $1", [
        unique_id,
      ]);
    }
  };