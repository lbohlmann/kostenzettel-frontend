# Kostenzettel Frontend
Kostenzettel frontend for source to image building

This repository contains the frontend of the Kostenzettel project.
It is intended to be containerized using an s2i build with the offfical RedHat NGINX Builder image.

For more information see:
[RedHat Container Catalog UBI NGINX Builder Image](https://catalog.redhat.com/software/containers/ubi8/nginx-118/5f521a6f9dd2d5ca7158e5dc?gti-tabs=get-the-source&container-tabs=overview)

The resulting container needs to be started with these environment variables:

**NAME_USER_1** -- The name of the first user of Kostenzettel

**NAME_USER_2** -- The name of the second user of Kostenzettel

**BACKEND_URL** -- The URL of the backend service (e.g. http://localhost:8080)

**BASIC_AUTH_USER** -- The username for basic authentication

**BASIC_AUTH_PASSWORD** -- The password for basic authentication

