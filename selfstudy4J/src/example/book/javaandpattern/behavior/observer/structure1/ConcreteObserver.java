package example.book.javaandpattern.behavior.observer.structure1;

public class ConcreteObserver implements Observer {

	@Override
	public void update() {
		System.out.println(getClass()+" observer update is called.");
	}

}
