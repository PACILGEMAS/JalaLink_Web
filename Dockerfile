FROM denoland/deno:2.5.4 AS builder

WORKDIR /app

COPY . .

RUN deno install

RUN deno task build

RUN mkdir -p /output && cp -r ./dist/* /output

FROM nginx:1.27.2-alpine

RUN rm -r /usr/share/nginx/html \
 && mkdir /usr/share/nginx/html

WORKDIR /usr/share/nginx/html

COPY --from=builder /output /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
