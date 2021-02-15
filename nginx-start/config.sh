# Create basic auth credentials from environment variables
echo -n "Configure basic authentication.. "
touch /opt/app-root/.basicauth
echo -n $BASIC_AUTH_USER >> /opt/app-root/.basicauth
echo -n ':' >> /opt/app-root/.basicauth
openssl passwd -apr1 $BASIC_AUTH_PASSWORD >> /opt/app-root/.basicauth
echo "done!"

# Replace consts in javascript
echo -n "Transfer environment variables to javascript.. "
mkdir /opt/app-root/temp
touch /opt/app-root/temp/list.js
while IFS="" read -r p || [ -n "$p" ]
do
    if [[ $p == "const backend_url"* ]] ;
    then
        echo "const backend_url = '$BACKEND_URL'" >> /opt/app-root/temp/list.js
    elif [[ $p == *"const user1_name"* ]] ;
    then
        echo "const user1_name = '$NAME_USER1'" >> /opt/app-root/temp/list.js
    elif [[ $p == *"const user2_name"* ]] ;
    then
        echo "const user2_name = '$NAME_USER2'" >> /opt/app-root/temp/list.js
    elif [[ $p == *"const basic_auth_user"* ]] ;
    then
        echo "const basic_auth_user = '$BASIC_AUTH_USER'" >> /opt/app-root/temp/list.js
    elif [[ $p == *"const basic_auth_password"* ]] ;
    then
        echo "const basic_auth_password = '$BASIC_AUTH_PASSWORD'" >> /opt/app-root/temp/list.js
    else
        printf '%s\n' "$p" >> /opt/app-root/temp/list.js
    fi
    
done < /opt/app-root/src/js/list.js
touch /opt/app-root/temp/add.js
while IFS="" read -r p || [ -n "$p" ]
do
    if [[ $p == *"const backend_url"* ]] ;
    then
        echo "const backend_url = '$BACKEND_URL'" >> /opt/app-root/temp/add.js
    elif [[ $p == *"const user1_name"* ]] ;
    then
        echo "const user1_name = '$NAME_USER1'" >> /opt/app-root/temp/add.js
    elif [[ $p == *"const user2_name"* ]] ;
    then
        echo "const user2_name = '$NAME_USER2'" >> /opt/app-root/temp/add.js
    elif [[ $p == *"const basic_auth_user"* ]] ;
    then
        echo "const basic_auth_user = '$BASIC_AUTH_USER'" >> /opt/app-root/temp/add.js
    elif [[ $p == *"const basic_auth_password"* ]] ;
    then
        echo "const basic_auth_password = '$BASIC_AUTH_PASSWORD'" >> /opt/app-root/temp/add.js
    else
        printf '%s\n' "$p" >> /opt/app-root/temp/add.js
    fi
    
done < /opt/app-root/src/js/add.js

mv /opt/app-root/temp/add.js /opt/app-root/src/js/add.js
mv /opt/app-root/temp/list.js /opt/app-root/src/js/list.js

rm -rf /opt/app-root/temp

# Remove documentation and licence
if test -f /opt/app-root/src/README.md;
then
    rm /opt/app-root/src/README.md
fi

if test -f /opt/app-root/src/LICENSE;
then
    rm /opt/app-root/src/LICENSE 
fi

if test -f /opt/app-root/src/.gitignore;
then
    rm /opt/app-root/src/.gitignore
fi

# Clear logs after reboot of container
if test -e /var/log/nginx/access.log;
then
    rm /var/log/nginx/access.log
fi

if test -e /var/log/nginx/error.log;
then
    rm /var/log/nginx/error.log
fi

echo "done!"