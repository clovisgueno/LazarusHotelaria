package br.org.ufpr.tcc.bc;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

/**
 * @see http://clubedosgeeks.com.br/programacao/java/java-criptografia-e-
 *      descriptografia-com-aes-chave-assimetrica
 */
public class CriptografiaBC {

	/**
	 * O valor da chave DEVE ter: 16, 24 ou 32 caracteres.
	 * 
	 * (256 / 8 = 32) 32 caracteres = 256 bits (192 / 8 = 24) 24 caracteres =
	 * 192 bits (128 / 8 = 16) 16 caracteres = 128 bits
	 */
	private static String chaveSimetricaString = "tcc-2017-lazarus";
	private static SecretKey chaveSimetricaClass;

	public CriptografiaBC() {
		
		byte[] chaveSimetricaByteArray = null;
		try {
			chaveSimetricaByteArray = chaveSimetricaString.getBytes("utf-8");
		} catch (UnsupportedEncodingException e) {
			chaveSimetricaByteArray = chaveSimetricaString.getBytes();
		} 
		
		chaveSimetricaClass = new SecretKeySpec(chaveSimetricaByteArray, "AES");
	}

	public static void main(String args[]) {

		try {
			CriptografiaBC aes2 = new CriptografiaBC();
			String msgOriginal = "fdsa flkdsaj çfjsda çfkjsdafçsadçfjks ";
			
			byte[] msg = msgOriginal.getBytes("utf-8");
			byte[] msgCriptografada = aes2.criptografar(msg);
			byte[] msgDescriptografada = aes2.descriptografar(msgCriptografada);
			
			System.out.println("O: " + new String(msg));
			System.out.println("C: " + new String(msgCriptografada));
			System.out.println("D: " + new String(msgDescriptografada));
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public byte[] criptografar(byte[] mensagem) throws NoSuchAlgorithmException, NoSuchPaddingException,
			InvalidKeyException, IllegalBlockSizeException, BadPaddingException, UnsupportedEncodingException {
		
		Cipher cipher = Cipher.getInstance("AES");
		cipher.init(Cipher.ENCRYPT_MODE, chaveSimetricaClass);
		
		/* Recebe a mensagem e encripta */
		return cipher.doFinal(mensagem);
		
	}
	
	public byte[] descriptografar(byte[] mensagemEncriptada) throws NoSuchAlgorithmException, NoSuchPaddingException,
	InvalidKeyException, IllegalBlockSizeException, BadPaddingException, UnsupportedEncodingException {

		Cipher cipher = Cipher.getInstance("AES");
		cipher.init(Cipher.DECRYPT_MODE, chaveSimetricaClass);
		
		/* Recebe a mensagem encriptada e descripta */
		return cipher.doFinal(mensagemEncriptada);
		
	}

}