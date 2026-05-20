import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { spawn } from "child_process";

const client = new SecretsManagerClient({
    region: process.env.AWS_REGION || "us-east-1"
});

try {
    const response = await client.send(
        new GetSecretValueCommand({
            SecretId: process.env.SECRET_NAME || "skilltern/backend/env"
        })
    );

    const secrets = JSON.parse(response.SecretString);

    // Merge fetched secrets with existing env vars (fetched secrets take priority)
    const env = { ...process.env, ...secrets };

    console.log("Secrets loaded from AWS. Starting app...");

    // Spawn the actual app with secrets injected into its environment
    const child = spawn("node", ["index.js"], {
        env,
        stdio: "inherit",
        cwd: process.cwd()
    });

    child.on("exit", (code) => process.exit(code ?? 0));
    child.on("error", (err) => {
        console.error("Failed to start app:", err.message);
        process.exit(1);
    });

} catch (err) {
    console.error("Failed to fetch secrets from AWS Secrets Manager:", err.message);
    process.exit(1);
}
