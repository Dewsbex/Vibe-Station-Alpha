{ pkgs, ... }: {
  channel = "stable-23.11";

  packages = [
    pkgs.nodejs_20
  ];

  idx = {
    extensions = [
      "ritwickdey.LiveServer"
    ];

    previews = {
      enable = true;
      previews = {
        web = {
          # Using a more robust command structure
          command = ["npx" "-y" "http-server" "-p" "$PORT" "--content-type" "text/html"];
          manager = "web";
        };
      };
    };
  };
}
