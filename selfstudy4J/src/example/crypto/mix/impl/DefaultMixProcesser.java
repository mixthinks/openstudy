package example.crypto.mix.impl;

import java.util.Date;

import example.crypto.mix.MixBlock;
import example.crypto.mix.MixProcesser;

public class DefaultMixProcesser implements MixProcesser {
	public final static DefaultMixProcesser get() {
		return new DefaultMixProcesser();
	}

	private long startTime;
	private long completeTime;

	@Override
	public void processed(MixBlock mixBlock) {
		System.out.println("Complete block:" + mixBlock);
	}

	@Override
	public void start() {
		startTime = new Date().getTime();
	}

	@Override
	public void completed() {
		completeTime = new Date().getTime();
		System.out.println("Cost time:"+cost());
	}

	@Override
	public long cost() {
		return this.completeTime-this.startTime;
	}

}
