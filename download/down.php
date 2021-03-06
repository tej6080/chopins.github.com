<?php

date_default_timezone_set('Etc/GMT-8');
set_time_limit(0);

$url = base64_decode($_GET['url']);
$t = $_GET['t'];
$dkey = date('(#Y--m-d-@--H-i%)');
$predkey = date('(#Y--m-d-@--H-i%)', strtotime('-1 Minute'));
$nextdkey = date('(#Y--m-d-@--H-i%)', strtotime('+1 Minute'));

$url = @openssl_decrypt($url, 'aes128', md5('th3is#pas)(#3swodfrd@key' . $dkey), 0, md5($t . '#this@ivEDkey', true));
if (!$url) {
    $url = @openssl_decrypt($url, 'aes128', md5('th3is#pas)(#3swodfrd@key' . $predkey), 0, md5($t . '#this@ivEDkey', true));
    if (!$url) {
        $url = @openssl_decrypt($url, 'aes128', md5('th3is#pas)(#3swodfrd@key' . $nextdkey), 0, md5($t . '#this@ivEDkey', true));
    }
}
$referer = '';
if (isset($_SERVER['r'])) {
    $referer = base64_decode($_GET['r']);
    $referer = @openssl_decrypt($referer, 'aes128', md5('th3is#pas)(#3swodfrd@key' . $dkey), 0, md5($t . '#this@ivEDkey', true));
    if (!$url) {
        $referer = @openssl_decrypt($referer, 'aes128', md5('th3is#pas)(#3swodfrd@key' . $predkey), 0, md5($t . '#this@ivEDkey', true));
        if (!$referer) {
            $referer = @openssl_decrypt($referer, 'aes128', md5('th3is#pas)(#3swodfrd@key' . $nextdkey), 0, md5($t . '#this@ivEDkey', true));
        }
    }
}

$dir = pathinfo($url);
$url_info = parse_url($url);
if (empty($url_info['scheme'])) {
    die("Scheme Error:{$url_info['scheme']}");
}

$header = '';
foreach ($_SERVER as $field => $fv) {
    if ($field == 'HTTP_HOST') {
        continue;
    }
    if ($field == 'HTTP_REFERER') {
        continue;
    }
    if (strpos($field, 'HTTP_') === 0) {
        $filename = str_replace(' ', '-', ucwords(strtolower(str_replace(array('HTTP_', '_'), array('', ' '), $field))));
        $header .= "$filename: $fv\r\n";
    }
}
if($referer) {
    $header .= "Referer: $referer\r\n";
}
$body = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $body = file_get_contents('php://input');
}
$filename = basename($dir['dirname']);
$opts = array(
    'http' => array(
        'method' => $_SERVER['REQUEST_METHOD'],
        'header' => $header,
        'content' => $body,
        'ignore_errors' => true,
        'follow_location' => 0
    )
);

$context = stream_context_create($opts);
$fp = false;
$is_text = false;

while (!$fp) {
    $fp = fopen($url, 'r', false, $context);

    if ($fp === false) {
        $err = error_get_last();
        print_r($err);
        die();
        list(, $status) = explode('HTTP/1.1', $err['message']);
        @header("Status: $status", true, 419);
        echo openssl_encrypt("Proxy:$status", 'aes128', md5('this body passowrd' . date('(#Y--m-d-@--H-i%)')), 0, md5($t . 'this body iv', true));
        die;
    }
    $stat = @stream_get_meta_data($fp);

    if (isset($stat['wrapper_data'])) {

        foreach ($stat['wrapper_data'] as $i => $header) {
            $header_split = explode(' ', $header, 3);
            if (strpos($header_split[0], 'HTTP') === 0 && $header_split[1] != '200' && $header_split[1] != '302' && $header_split[1] != '301') {
                @header("$header");
                echo openssl_encrypt("Server:$header", 'aes128', md5('this body passowrd' . date('(#Y--m-d-@--H-i%)')), 0, md5($t . 'this body iv', true));
                die;
            }
            if (strpos($header_split[0], 'HTTP') === 0 && ($header_split[1] == '302' || $header_split[1] == '301')) {
                foreach ($stat['wrapper_data'] as $i => $header) {
                    if (strpos($header, 'Location: ') !== false) {
                        list(, $url) = explode(':', $header, 2);
                        $url = trim($url);
                        break;
                    }
                }

                fclose($fp);
                $fp = false;
                break;
            }
            if (strpos($header, 'Content-Type: text') !== false) {
                $is_text = true;
            }

            @header($header);
        }
    } else {
        @header("Content-type: application/vnd.android.package-delta;charset=utf-8");
        @header("Accept-Ranges:bytes");
    }
}
//@header('Content-Disposition: attachment; filename="' . $filename . '"');

if ($is_text) {
    ob_start();
}

@fpassthru($fp);

if ($is_text) {
    $body = openssl_encrypt(ob_get_contents(), 'aes128', md5('this body passowrd' . date('(#Y--m-d-@--H-i%)')), 0, md5($t . 'this body iv', true));
    ob_end_clean();
    echo $body;
}
@fclose($fp);
