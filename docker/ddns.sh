#!/usr/bin/env bash

set -u

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ENV_FILE="$SCRIPT_DIR/.env"
LOG_FILE="$SCRIPT_DIR/ddns.log"

if [ ! -f "$ENV_FILE" ]; then
    echo "No existe $ENV_FILE"
    exit 1
fi

# shellcheck disable=SC1090
. "$ENV_FILE"

: "${API_TOKEN:?API_TOKEN no definido en .env}"
: "${ZONE_ID:?ZONE_ID no definido en .env}"
: "${DOMAIN:=sardinitasenelmar.com}"
: "${IP_SERVIDOR:=}"
: "${RECORD_ID:=}"

actualizar_env() {
    variable="$1"
    valor="$2"

    if grep -q "^${variable}=" "$ENV_FILE"; then
        TEMP_FILE=$(mktemp "${ENV_FILE}.tmp.XXXXXX") || return 1
        sed "s|^${variable}=.*|${variable}=${valor}|" "$ENV_FILE" > "$TEMP_FILE" || {
            rm -f "$TEMP_FILE"
            return 1
        }
        cat "$TEMP_FILE" > "$ENV_FILE"
        STATUS=$?
        rm -f "$TEMP_FILE"
        return "$STATUS"
    else
        printf '%s=%s\n' "$variable" "$valor" >> "$ENV_FILE"
    fi
}

registrar_cambio() {
    printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')" "$1" >> "$LOG_FILE"
}

# Obtener la IP publica actual.
PUBLIC_IP=$(curl -fsS https://ifconfig.me)
if [ $? -ne 0 ] || [ -z "$PUBLIC_IP" ]; then
    echo "Error obteniendo ip publica"
    exit 1
fi

# Si la IP guardada coincide, no es necesario consultar Cloudflare.
if [ -n "$IP_SERVIDOR" ] && [ "$IP_SERVIDOR" = "$PUBLIC_IP" ]; then
    echo "Sin cambios. IP actual: $PUBLIC_IP"
    exit 0
fi

# Obtener el ID del registro A solo si no esta guardado en .env.
if [ -z "$RECORD_ID" ]; then
    RECORD_ID=$(curl -fsS -X GET \
      "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=A&name=$DOMAIN" \
      -H "Authorization: Bearer $API_TOKEN" \
      -H "Content-Type: application/json" | jq -r '.result[0].id')
fi

if [ -z "$RECORD_ID" ] || [ "$RECORD_ID" = "null" ]; then
  echo "No se encontró el registro A para $DOMAIN"
  exit 1
fi

# Actualizar el registro A con la nueva IP.
RESPONSE=$(curl -fsS -X PUT \
    "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
  --data "{\"type\":\"A\",\"name\":\"$DOMAIN\",\"content\":\"$PUBLIC_IP\",\"ttl\":120,\"proxied\":false}")

if ! echo "$RESPONSE" | jq -e '.success == true' >/dev/null; then
    echo "Error actualizando el registro A"
    exit 1
fi

IP_ANTERIOR="${IP_SERVIDOR:-desconocida}"
actualizar_env "IP_SERVIDOR" "$PUBLIC_IP"
actualizar_env "RECORD_ID" "$RECORD_ID"
registrar_cambio "IP actualizada: $IP_ANTERIOR -> $PUBLIC_IP"
echo "IP actualizada: $IP_ANTERIOR -> $PUBLIC_IP"
