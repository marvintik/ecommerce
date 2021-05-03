import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

class DellMeTests {

    @Test
    void contextLoads() {
        A a = new A();
        boolean b = false;
        if (b == a.isEng())
            a.greeting();
        else if( b == new B().isEng())
            new B().greeting();
    }

    @Test
    void contextLoads1() {
        Greeter a = new B();
        a.greeting();
    }

    interface Greeter{
        void greeting();
    }

    class A implements Greeter{
        public boolean isEng() {
            return true;
        }

        public void greeting() {
            System.out.println("hello");
        }
    }

    class B implements Greeter {
        public boolean isEng() {
            return false;
        }

        public void greeting() {
            System.out.println("Привет");
        }
    }

    class C implements Greeter {
        public boolean isEng() {
            return false;
        }

        public void greeting() {
            System.out.println("Привiт");
        }
    }

}
