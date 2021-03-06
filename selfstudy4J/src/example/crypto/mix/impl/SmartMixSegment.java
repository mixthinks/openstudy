/**
 * 
 */
package example.crypto.mix.impl;

import example.crypto.mix.Segment;

/**
 * @author minjdai
 *
 */
public final class SmartMixSegment extends DefaultMixSegment {

	public static final SmartMixSegment get(){
		return new SmartMixSegment();
	}
	
	@Override
	public Segment[] calcuate(long fileLength) {
		smartAnalysis(fileLength);
		return super.calcuate(fileLength);
	}

	private void smartAnalysis(long fileLength) {
		long nmb = fileLength/(1024*1024);
		if(nmb<=1){
			long nkb = fileLength/(1024*10);
			if(nkb<1){ // 1 <=> 1 kb
				setSpace((int) (1));
			}else{	// 1*n <=> 10*n kb
				setSpace((int) (1*nkb));
			}
			
		}else{
			setSpace((int) (100*nmb));
		}
		
	}

}
