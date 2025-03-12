import os
import yaml

class MyAppConfig:
    def __init__(self):
        self.env = os.getenv("ENV", "local")
        # Change cwd to point to config directory
        self.cwd = os.path.dirname(os.path.abspath(__file__))
        self.config = self.load_config()
        self.EXCLUDED_APIS = self.config.get("app", {}).get("EXCLUDED_APIS", [])
        
    
    def load_config(self):
        config = {}
        # Now we can use just the filename since we're already in the config directory
        default_config_path = os.path.join(self.cwd, "default_application.yaml")
        with open(default_config_path, 'r') as file:
            config.update(yaml.safe_load(file))
        # Load secrets only in non-production environments
        if self.env not in ["production"]:
            secrets_config_path = os.path.join(self.cwd, "secrets.yaml")
            if os.path.exists(secrets_config_path):
                with open(secrets_config_path, 'r') as file:
                    config.update(yaml.safe_load(file))
        
        return config

config = MyAppConfig()
EXCLUDED_APIS = config.EXCLUDED_APIS
