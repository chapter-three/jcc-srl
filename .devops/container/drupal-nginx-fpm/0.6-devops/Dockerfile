FROM judicialcouncil/drupal-nginx-fpm:0.8
LABEL maintainer="Azure App Service Container Images <appsvc-images@microsoft.com>"
LABEL maintainer="Ivan Bueno <ivan.bueno@jud.ca.gov>"
# ========
# ENV vars
# ========
# drupal
ARG GIT_REPO="https://github.com/JudicialCouncilOfCalifornia/jcc-srl.git"
ENV GIT_REPO=$GIT_REPO
ARG GIT_BRANCH="master"
ENV GIT_BRANCH=$GIT_BRANCH
ENV DRUPAL_HOME "/var/www/html"
ENV DRUPAL_PRJ "/var/drupal_prj"
#nginx
ENV NGINX_LOG_DIR "/home/LogFiles/nginx"
#varnish
ENV VARNISH_LOG_DIR "/home/LogFiles/varnish"
#php
ENV PHP_CONF_FILE "/usr/local/etc/php/php.ini"
# ====================
# Download and Install
# ~. essentials
# 1. Drupal
# ====================
RUN set -ex \
# --------
# ~. essentials
# --------
# ~. PHP extensions
# --------
# -------------
# 1. Drupal
# -------------
# ----------
# 2. composer
# ----------
# ----------
# 3. drush
# ----------
# ----------
# 4. varnish
# ----------

# ----------
# ~. clean up
# ----------
	&& apk upgrade \
	&& rm -rf /var/cache/apk/* \
	&& rm -rf /etc/nginx/conf.d/default.conf
# =========
# Build source
# =========
RUN set -ex \
  && git clone ${GIT_REPO} --branch ${GIT_BRANCH} ${DRUPAL_BUILD} \
  && rm -rf ${DRUPAL_BUILD}/.git \
  && cd ${DRUPAL_BUILD} \
  && composer install --no-dev --no-interaction --optimize-autoloader \
  && npm install --prefix=web/themes/custom/atrium && npm run production --prefix=web/themes/custom/atrium
# =========
# Configure
# =========
WORKDIR $DRUPAL_HOME
# nginx
COPY nginx.conf /etc/nginx/
# drupal
COPY settings.local.php ${DRUPAL_SOURCE}
# =====
# final
# =====
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh
EXPOSE 2222 80
ENTRYPOINT ["entrypoint.sh"]
