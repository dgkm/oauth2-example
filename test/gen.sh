openssl genrsa -aes256 -passout pass:somepassword -out private.pem 2048 
openssl rsa -in private.pem -outform PEM -pubout -out public.pem -passin pass:somepassword
openssl rsa -in private.pem -out private.key -passin pass:somepassword
