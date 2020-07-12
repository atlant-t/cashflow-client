# Adding certificates

## Linux

### Generate certificate

Become a Certificate Authority.

- Generate private key of Authority
  ```sh
  openssl genrsa \
          -des3 \
          -out development.key \
          2048
  ```

- Generate root certificate of Authority
  ```sh
  openssl req \
          -x509 \
          -new \
          -nodes \
          -key development.key \
          -sha256 \
          -days 825 \
          -out development.pem
  ```

Create CA-signed certs

- Generate private key
  ```sh
  openssl genrsa \
          -out localhost.key \
          2048
  ```

- Create a certificate-signing request
  ```sh
  openssl req \
          -new \
          -key localhost.key \
          -out localhost.csr
  ```

- Create a config file for the extensions
  ```sh
  >localhost.ext cat <<-EOF
  authorityKeyIdentifier=keyid,issuer
  basicConstraints=CA:FALSE
  keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
  subjectAltName = @alt_names
  [alt_names]
  DNS.1 = localhost
  IP.1 = 127.0.0.1
  EOF
  ```

- Create the signed certificate
  ```sh
  openssl x509 \
          -req \
          -in localhost.csr \
          -CA development.pem \
          -CAkey development.key \
          -CAcreateserial \
          -out localhost.crt \
          -days 825 \
          -sha256 \
          -extfile localhost.ext
  ```

### Add certificate to system

To add a certificate to the systemwide list of trusted certificates, place the new certificate in /usr/local/share/ca-certificates/

Note: _Run from root_

```sh
mkdir -p /usr/local/share/ca-certificates/
```

```sh
cp localhost.crt /usr/local/share/ca-certificates/
```

Make sure users have necessary read access to the directory/certificates, or users won't trust them due to read failures. Also make sure untrusted users don't have write access!

Then either run

```sh
update-ca-certificates
```

## Adding Certificate Authority to browser

### Chrome (Chromium)

- Open `chrome://settings/certificates`
- Choose Authorities tab
- Import `development.pem` (CA certificate)


## References
- [Running Angular CLI over HTTPS with a Trusted Certificate](https://medium.com/@rubenvermeulen/running-angular-cli-over-https-with-a-trusted-certificate-4a0d5f92747a)
- [How to Create Your Own SSL Certificate Authority for Local HTTPS Development](https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/)
- [Adding trusted root certificates to the server](https://manuals.gfi.com/en/kerio/connect/content/server-configuration/ssl-certificates/adding-trusted-root-certificates-to-the-server-1605.html)
- [Getting Chrome to accept self-signed localhost certificate](https://stackoverflow.com/questions/7580508/getting-chrome-to-accept-self-signed-localhost-certificate)
