<?php
# PHPreCAPTCHA v0.1
# GNU General Public License v3.0
# This is a PHP library for Google's reCAPTCHA 2.0
# Created by Martin Georgiev, geeorgiev[at]gmail.com
# Web: www.viziongames.com
/**
 * recaptchalib class
 */
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
class recaptchalib
{
    /**
     * @var string
     */
    protected $secret;
	//echo "Secret".$secret;
    /**
     * @var string
     */
    protected $response;
    /**
     * @var string
     */
    protected $URL;
    function __construct($secret, $response){
		echo "\nResponse".$response;
        $this->secret = $secret;
        $this->response = $response;
        $this->URL = 'https://www.google.com/recaptcha/api/siteverify';
    }
    /**
     * Validating reCAPTCHA response
     * Response is collected from $_POST["g-recaptcha-response"]
     *
     * @param string $response
     * @return booleans
     */
    public function isValid(){
        $data = array(
            'secret' => $this->secret,
            'response' => $this->response
        );
        $options = array(
            'http' => array (
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data)
            )
        );
		echo "\n$options[http]: ".$options['http'];
		echo "\n$options[http][content]: ".$options['http']['content'];
        $context  = stream_context_create($options);
		echo "\n$context: " . $context;
        $verify = file_get_contents($this->URL, false, $context);
		echo "\n$verify: " . $verify;
		echo "\n$this->fromJson($verify): " . $this->fromJson($verify);
        return $this->fromJson($verify);
    }
    /**
     * Return response from the expected JSON returned by the service.
     *
     * @param string $json
     * @return string
     */
    public function fromJson($json){
        $responseData = json_decode($json, true);
        if (!$responseData) {
            return false;
        }
        $hostname = isset($responseData['hostname']) ? $responseData['hostname'] : null;
        if (isset($responseData['success']) && $responseData['success'] == true) {
            return $responseData['success'];
        }
        if (isset($responseData['error-codes']) && is_array($responseData['error-codes'])) {
            return false;
        }
        return false;
    }
}